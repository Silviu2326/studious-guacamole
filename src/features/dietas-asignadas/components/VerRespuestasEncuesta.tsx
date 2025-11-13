import React from 'react';
import { Modal, Card, Badge } from '../../../components/componentsreutilizables';
import { BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  EncuestaRapida,
  InsightEncuestaRapida,
} from '../types';

interface VerRespuestasEncuestaProps {
  encuesta: EncuestaRapida;
  insights: InsightEncuestaRapida;
  onClose: () => void;
}

export const VerRespuestasEncuesta: React.FC<VerRespuestasEncuestaProps> = ({
  encuesta,
  insights,
  onClose,
}) => {
  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Respuestas: ${encuesta.nombre}`}
      size="xl"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">Total de respuestas</div>
            <div className="text-2xl font-bold text-gray-900">
              {insights.totalRespuestas}
            </div>
          </div>
          {insights.promedioPuntuacion !== undefined && (
            <div>
              <div className="text-sm text-gray-600">Promedio</div>
              <div className="text-2xl font-bold text-gray-900">
                {insights.promedioPuntuacion.toFixed(2)}
              </div>
            </div>
          )}
        </div>

        {insights.distribucionRespuestas && insights.distribucionRespuestas.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Distribución de Respuestas</h4>
            {insights.distribucionRespuestas.map(distribucion => (
              <Card key={distribucion.preguntaId} className="p-4">
                <div className="font-medium text-gray-900 mb-3">
                  {distribucion.preguntaTexto}
                </div>
                <div className="space-y-2">
                  {Object.entries(distribucion.distribucion).map(([valor, cantidad]) => {
                    const porcentaje = (cantidad / insights.totalRespuestas) * 100;
                    return (
                      <div key={valor} className="flex items-center gap-3">
                        <div className="w-20 text-sm text-gray-600">{valor}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div
                              className="bg-blue-500 h-6 rounded"
                              style={{ width: `${porcentaje}%` }}
                            />
                            <span className="text-sm text-gray-600">{cantidad}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {distribucion.promedio !== undefined && (
                    <div className="mt-2 text-sm text-gray-600">
                      Promedio: {distribucion.promedio.toFixed(2)}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {insights.respuestasTexto && insights.respuestasTexto.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Respuestas de Texto</h4>
            {insights.respuestasTexto.map(respuesta => (
              <Card key={respuesta.preguntaId} className="p-4">
                <div className="font-medium text-gray-900 mb-3">
                  {respuesta.preguntaTexto}
                </div>
                <div className="space-y-2">
                  {respuesta.respuestas.map((texto, index) => (
                    <div key={index} className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                      {texto}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}

        {insights.tendencia && (
          <Card className="p-4 bg-blue-50 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-blue-900">Tendencia</span>
              {insights.tendencia === 'mejora' && (
                <Badge variant="success">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Mejora
                </Badge>
              )}
              {insights.tendencia === 'empeora' && (
                <Badge variant="destructive">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  Empeora
                </Badge>
              )}
              {insights.tendencia === 'estable' && (
                <Badge variant="secondary">
                  <Minus className="w-3 h-3 mr-1" />
                  Estable
                </Badge>
              )}
            </div>
          </Card>
        )}

        {insights.recomendaciones && insights.recomendaciones.length > 0 && (
          <Card className="p-4 bg-yellow-50 border border-yellow-200">
            <div className="font-medium text-yellow-900 mb-2">Recomendaciones</div>
            <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800">
              {insights.recomendaciones.map((recomendacion, index) => (
                <li key={index}>{recomendacion}</li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </Modal>
  );
};

