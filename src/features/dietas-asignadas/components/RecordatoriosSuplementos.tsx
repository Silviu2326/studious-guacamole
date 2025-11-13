import React from 'react';
import { Card, Badge } from '../../../components/componentsreutilizables';
import { Pill, Droplets, Clock } from 'lucide-react';
import { Recordatorio, TipoComida } from '../types';

interface RecordatoriosSuplementosProps {
  recordatorios: Recordatorio[];
  tipoComida?: TipoComida;
  comidaId?: string;
  dia?: string;
  className?: string;
}

export const RecordatoriosSuplementos: React.FC<RecordatoriosSuplementosProps> = ({
  recordatorios,
  tipoComida,
  comidaId,
  dia,
  className = '',
}) => {
  // Filtrar recordatorios relevantes
  const recordatoriosFiltrados = recordatorios.filter((recordatorio) => {
    if (!recordatorio.activo) return false;
    
    // Si se especifica un tipoComida, filtrar por ese tipo
    if (tipoComida && recordatorio.tipoComidaAsociada) {
      if (recordatorio.tipoComidaAsociada !== tipoComida) return false;
    }
    
    // Si se especifica una comidaId, filtrar por esa comida
    if (comidaId && recordatorio.comidaId) {
      if (recordatorio.comidaId !== comidaId) return false;
    }
    
    // Si se especifica un día, filtrar por ese día
    if (dia && recordatorio.dia) {
      if (recordatorio.dia !== dia) return false;
    }
    
    return true;
  });

  if (recordatoriosFiltrados.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {recordatoriosFiltrados.map((recordatorio) => {
        if (recordatorio.tipo === 'suplemento') {
          return (
            <Card
              key={recordatorio.id}
              className="bg-amber-50 border-amber-200 border-l-4 border-l-amber-500 p-3"
            >
              <div className="flex items-start gap-2">
                <Pill className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-amber-900">
                      {recordatorio.nombre}
                    </span>
                    {recordatorio.cantidad && (
                      <Badge className="bg-amber-100 text-amber-700 text-xs">
                        {recordatorio.cantidad}
                      </Badge>
                    )}
                    {recordatorio.horario && (
                      <div className="flex items-center gap-1 text-xs text-amber-700">
                        <Clock className="w-3 h-3" />
                        <span>{recordatorio.horario}</span>
                      </div>
                    )}
                  </div>
                  {recordatorio.notas && (
                    <p className="text-xs text-amber-700 mt-1">{recordatorio.notas}</p>
                  )}
                </div>
              </div>
            </Card>
          );
        } else {
          // Recordatorio de hidratación
          return (
            <Card
              key={recordatorio.id}
              className="bg-blue-50 border-blue-200 border-l-4 border-l-blue-500 p-3"
            >
              <div className="flex items-start gap-2">
                <Droplets className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-blue-900">
                      Hidratación
                    </span>
                    <Badge className="bg-blue-100 text-blue-700 text-xs">
                      {recordatorio.cantidad} ml
                    </Badge>
                    {recordatorio.horario && (
                      <div className="flex items-center gap-1 text-xs text-blue-700">
                        <Clock className="w-3 h-3" />
                        <span>{recordatorio.horario}</span>
                      </div>
                    )}
                  </div>
                  {recordatorio.notas && (
                    <p className="text-xs text-blue-700 mt-1">{recordatorio.notas}</p>
                  )}
                </div>
              </div>
            </Card>
          );
        }
      })}
    </div>
  );
};

