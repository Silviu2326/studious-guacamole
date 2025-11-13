import React, { useState, useEffect } from 'react';
import { Modal, Button, Badge } from '../../../components/componentsreutilizables';
import {
  X,
  ChefHat,
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle2,
  Info,
  Leaf,
} from 'lucide-react';
import {
  RecursoBiblioteca,
  AdherenciaHistoricaRecurso,
  Alergeno,
} from '../types';
import { getAdherenciaHistoricaRecurso } from '../api/recursos';

interface PreviewRecursoProps {
  recurso: RecursoBiblioteca;
  clienteId?: string;
  clienteNombre?: string;
  isOpen: boolean;
  onClose: () => void;
}

const alergenoLabels: Record<Alergeno, string> = {
  gluten: 'Gluten',
  lactosa: 'Lactosa',
  huevos: 'Huevos',
  pescado: 'Pescado',
  mariscos: 'Mariscos',
  'frutos-secos': 'Frutos secos',
  cacahuetes: 'Cacahuetes',
  soja: 'Soja',
  sesamo: 'Sésamo',
  apio: 'Apio',
  mostaza: 'Mostaza',
  altramuces: 'Altramuces',
  moluscos: 'Moluscos',
  sulfitos: 'Sulfitos',
};

export const PreviewRecurso: React.FC<PreviewRecursoProps> = ({
  recurso,
  clienteId,
  clienteNombre,
  isOpen,
  onClose,
}) => {
  const [adherencia, setAdherencia] = useState<AdherenciaHistoricaRecurso | null>(null);
  const [cargandoAdherencia, setCargandoAdherencia] = useState(false);

  useEffect(() => {
    if (isOpen && clienteId) {
      cargarAdherencia();
    } else {
      setAdherencia(null);
    }
  }, [isOpen, clienteId, recurso.id]);

  const cargarAdherencia = async () => {
    if (!clienteId) return;

    setCargandoAdherencia(true);
    try {
      const data = await getAdherenciaHistoricaRecurso(clienteId, recurso.id);
      setAdherencia(data);
    } catch (error) {
      console.error('Error cargando adherencia:', error);
    } finally {
      setCargandoAdherencia(false);
    }
  };

  const getIconoTendencia = () => {
    if (!adherencia?.tendencia) return <Minus className="h-4 w-4 text-slate-400" />;
    
    switch (adherencia.tendencia) {
      case 'mejora':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'empeora':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-slate-400" />;
    }
  };

  const getColorAdherencia = (adherenciaPromedio: number) => {
    if (adherenciaPromedio >= 80) return 'text-green-600';
    if (adherenciaPromedio >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={recurso.nombre} size="lg">
      <div className="space-y-6">
        {/* Descripción */}
        {recurso.descripcion && (
          <div>
            <p className="text-sm text-slate-600">{recurso.descripcion}</p>
          </div>
        )}

        {/* Macros detallados */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <ChefHat className="h-4 w-4 text-blue-500" />
            Macros Nutricionales
          </h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-xs text-blue-600 font-medium uppercase tracking-wide mb-1">
                Calorías
              </div>
              <div className="text-xl font-bold text-blue-900">
                {recurso.macros.calorias}
              </div>
              <div className="text-xs text-blue-600">kcal</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-xs text-green-600 font-medium uppercase tracking-wide mb-1">
                Proteínas
              </div>
              <div className="text-xl font-bold text-green-900">
                {recurso.macros.proteinas}g
              </div>
              <div className="text-xs text-green-600">
                {((recurso.macros.proteinas * 4) / recurso.macros.calorias * 100).toFixed(1)}%
              </div>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <div className="text-xs text-orange-600 font-medium uppercase tracking-wide mb-1">
                Carbohidratos
              </div>
              <div className="text-xl font-bold text-orange-900">
                {recurso.macros.carbohidratos}g
              </div>
              <div className="text-xs text-orange-600">
                {((recurso.macros.carbohidratos * 4) / recurso.macros.calorias * 100).toFixed(1)}%
              </div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-xs text-purple-600 font-medium uppercase tracking-wide mb-1">
                Grasas
              </div>
              <div className="text-xl font-bold text-purple-900">
                {recurso.macros.grasas}g
              </div>
              <div className="text-xs text-purple-600">
                {((recurso.macros.grasas * 9) / recurso.macros.calorias * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Información nutricional adicional */}
          <div className="grid grid-cols-3 gap-3 mt-3">
            {recurso.fibra !== undefined && (
              <div className="text-sm">
                <span className="text-slate-500">Fibra:</span>{' '}
                <span className="font-semibold text-slate-900">{recurso.fibra}g</span>
              </div>
            )}
            {recurso.sodio !== undefined && (
              <div className="text-sm">
                <span className="text-slate-500">Sodio:</span>{' '}
                <span className="font-semibold text-slate-900">{recurso.sodio}mg</span>
              </div>
            )}
            {recurso.tiempoPreparacion && (
              <div className="text-sm flex items-center gap-1">
                <Clock className="h-3 w-3 text-slate-400" />
                <span className="text-slate-500">Tiempo:</span>{' '}
                <span className="font-semibold text-slate-900">{recurso.tiempoPreparacion} min</span>
              </div>
            )}
          </div>
        </div>

        {/* Alérgenos */}
        {recurso.alergenos && recurso.alergenos.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Alérgenos
            </h3>
            <div className="flex flex-wrap gap-2">
              {recurso.alergenos.map((alergeno) => (
                <Badge
                  key={alergeno}
                  className="bg-amber-50 text-amber-700 border border-amber-200"
                >
                  {alergenoLabels[alergeno]}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Coste estimado y huella de carbono */}
        {(recurso.costeEstimado !== undefined || recurso.huellaCarbono !== undefined) && (
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              Sostenibilidad y Presupuesto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recurso.costeEstimado !== undefined && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span className="text-xs font-medium text-green-600 uppercase tracking-wide">
                      Coste Estimado
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-green-900">
                    {recurso.costeEstimado.toFixed(2)} €
                  </div>
                  <div className="text-xs text-green-600 mt-1">Por porción</div>
                </div>
              )}
              {recurso.huellaCarbono !== undefined && (
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Leaf className="h-4 w-4 text-emerald-500" />
                    <span className="text-xs font-medium text-emerald-600 uppercase tracking-wide">
                      Huella de Carbono
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-emerald-900">
                    {recurso.huellaCarbono.toFixed(2)} kg CO₂
                  </div>
                  <div className="text-xs text-emerald-600 mt-1">Equivalente por porción</div>
                </div>
              )}
            </div>
            {(recurso.certificado || recurso.ingredientesTemporada) && (
              <div className="flex flex-wrap gap-2 mt-3">
                {recurso.certificado && (
                  <Badge className="bg-green-50 text-green-700 border border-green-200">
                    <CheckCircle2 className="h-3 w-3 mr-1 inline" />
                    Certificado
                  </Badge>
                )}
                {recurso.ingredientesTemporada && (
                  <Badge className="bg-blue-50 text-blue-700 border border-blue-200">
                    <Leaf className="h-3 w-3 mr-1 inline" />
                    Ingredientes de Temporada
                  </Badge>
                )}
              </div>
            )}
          </div>
        )}

        {/* Adherencia histórica del cliente */}
        {clienteId && (
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              Adherencia Histórica
              {clienteNombre && (
                <span className="text-xs text-slate-500 font-normal">
                  ({clienteNombre})
                </span>
              )}
            </h3>
            {cargandoAdherencia ? (
              <div className="text-sm text-slate-500">Cargando datos de adherencia...</div>
            ) : adherencia ? (
              <div className="bg-slate-50 p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Adherencia Promedio</div>
                    <div className={`text-2xl font-bold ${getColorAdherencia(adherencia.adherenciaPromedio)}`}>
                      {adherencia.adherenciaPromedio.toFixed(1)}%
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getIconoTendencia()}
                    <span className="text-xs text-slate-500 capitalize">
                      {adherencia.tendencia}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-slate-500">Veces usado:</span>{' '}
                    <span className="font-semibold text-slate-900">{adherencia.vecesUsado}</span>
                  </div>
                  {adherencia.ultimoUso && (
                    <div>
                      <span className="text-slate-500">Último uso:</span>{' '}
                      <span className="font-semibold text-slate-900">
                        {new Date(adherencia.ultimoUso).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  )}
                </div>
                {adherencia.observaciones && (
                  <div className="text-xs text-slate-600 bg-white p-2 rounded border border-slate-200">
                    <Info className="h-3 w-3 inline mr-1" />
                    {adherencia.observaciones}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-500">
                No hay datos históricos de adherencia para este cliente y recurso.
              </div>
            )}
          </div>
        )}

        {/* Estilos culinarios y tags */}
        <div className="flex flex-wrap gap-4">
          {recurso.estiloCulinario && recurso.estiloCulinario.length > 0 && (
            <div>
              <div className="text-xs text-slate-500 mb-2">Estilos culinarios</div>
              <div className="flex flex-wrap gap-1">
                {recurso.estiloCulinario.map((estilo) => (
                  <Badge key={estilo} className="bg-indigo-50 text-indigo-600">
                    {estilo}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {recurso.tags && recurso.tags.length > 0 && (
            <div>
              <div className="text-xs text-slate-500 mb-2">Tags</div>
              <div className="flex flex-wrap gap-1">
                {recurso.tags.map((tag) => (
                  <Badge key={tag} className="bg-slate-100 text-slate-600">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Botón de cierre */}
        <div className="flex justify-end pt-4 border-t border-slate-200">
          <Button onClick={onClose}>Cerrar</Button>
        </div>
      </div>
    </Modal>
  );
};

