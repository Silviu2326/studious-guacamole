import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { Receta } from '../types';
import { getRecetasFavoritas } from '../api/favoritos';
import { RecetarioList } from './RecetarioList';
import { Heart } from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';

interface FavoritosComidaProps {
  onVerReceta?: (receta: Receta) => void;
  onEditarReceta?: (receta: Receta) => void;
  onEliminarReceta?: (receta: Receta) => void;
  onToggleFavorito?: (receta: Receta) => void;
}

export const FavoritosComida: React.FC<FavoritosComidaProps> = ({
  onVerReceta,
  onEditarReceta,
  onEliminarReceta,
  onToggleFavorito,
}) => {
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarFavoritos();
  }, []);

  const cargarFavoritos = async () => {
    setCargando(true);
    try {
      const favoritas = await getRecetasFavoritas();
      setRecetas(favoritas);
    } catch (error) {
      console.error('Error cargando favoritos:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleToggleFavorito = async (receta: Receta) => {
    if (onToggleFavorito) {
      onToggleFavorito(receta);
      await cargarFavoritos();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} flex items-center gap-2`}>
            <Heart className="w-6 h-6 text-red-500 fill-red-500" />
            Recetas Favoritas
          </h3>
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mt-2`}>
            {recetas.length} recetas guardadas como favoritas
          </p>
        </div>
      </div>

      <RecetarioList
        recetas={recetas}
        cargando={cargando}
        onVer={onVerReceta}
        onEditar={onEditarReceta}
        onEliminar={onEliminarReceta}
        onToggleFavorito={handleToggleFavorito}
      />
    </div>
  );
};

