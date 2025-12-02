import React from 'react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { Image, CheckCircle, XCircle, Camera, Clock } from 'lucide-react';
import { FotoComida } from '../types';
import { ds } from '../../adherencia/ui/ds';

interface FotosComidaProps {
  fotos: FotoComida[];
  onValidar?: (fotoId: string, validada: boolean) => void;
  onSubir?: () => void;
}

export const FotosComida: React.FC<FotosComidaProps> = ({
  fotos,
  onValidar,
  onSubir,
}) => {
  const getTipoComidaLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      desayuno: 'Desayuno',
      'media-manana': 'Media Mañana',
      almuerzo: 'Almuerzo',
      merienda: 'Merienda',
      cena: 'Cena',
      'post-entreno': 'Post Entreno',
    };
    return labels[tipo] || tipo;
  };

  const fotosValidadas = fotos.filter(f => f.validada).length;
  const fotosPendientes = fotos.filter(f => !f.validada).length;

  if (fotos.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
          No hay fotos de comida
        </h3>
        <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-4`}>
          El cliente aún no ha subido fotos de sus comidas
        </p>
        {onSubir && (
          <Button variant="primary" onClick={onSubir}>
            <Camera className="w-5 h-5 mr-2" />
            Subir Foto
          </Button>
        )}
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {onSubir && (
          <Button variant="primary" onClick={onSubir}>
            <Camera className="w-5 h-5 mr-2" />
            Subir Nueva Foto
          </Button>
        )}
        {!onSubir && <div />}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-semibold text-gray-700">
              {fotosValidadas} validadas
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            <span className="text-sm font-semibold text-gray-700">
              {fotosPendientes} pendientes
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fotos.map((foto) => (
          <Card key={foto.id} className="p-4">
            <div className="relative mb-3">
              <img
                src={foto.url}
                alt={`Foto ${getTipoComidaLabel(foto.tipoComida)}`}
                className="w-full h-48 object-cover rounded-lg"
              />
              <Badge
                className={`absolute top-2 right-2 ${
                  foto.validada
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {foto.validada ? (
                  <CheckCircle className="w-4 h-4 inline mr-1" />
                ) : (
                  <Clock className="w-4 h-4 inline mr-1" />
                )}
                {foto.validada ? 'Validada' : 'Pendiente'}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                  {getTipoComidaLabel(foto.tipoComida)}
                </span>
                <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                  {new Date(foto.fecha).toLocaleDateString('es-ES')}
                </span>
              </div>
              {foto.comentario && (
                <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                  {foto.comentario}
                </p>
              )}
              {onValidar && !foto.validada && (
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    onClick={() => onValidar(foto.id, true)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Validar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onValidar(foto.id, false)}
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

