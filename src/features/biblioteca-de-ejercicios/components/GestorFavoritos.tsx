import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/componentsreutilizables';
import { Heart } from 'lucide-react';
import { agregarFavorito, eliminarFavorito, esFavorito } from '../api/favoritos';

interface GestorFavoritosProps {
  ejercicioId: string;
  esFavoritoInicial?: boolean;
  onCambio?: (esFavorito: boolean) => void;
  className?: string;
}

export const GestorFavoritos: React.FC<GestorFavoritosProps> = ({
  ejercicioId,
  esFavoritoInicial = false,
  onCambio,
  className = '',
}) => {
  const [esFavoritoEstado, setEsFavoritoEstado] = useState(esFavoritoInicial);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const verificarFavorito = async () => {
      const resultado = await esFavorito(ejercicioId);
      setEsFavoritoEstado(resultado);
    };
    verificarFavorito();
  }, [ejercicioId]);

  const toggleFavorito = async () => {
    setCargando(true);
    try {
      if (esFavoritoEstado) {
        const exito = await eliminarFavorito(ejercicioId);
        if (exito) {
          setEsFavoritoEstado(false);
          onCambio?.(false);
          // Disparar evento personalizado para refrescar listas
          window.dispatchEvent(new CustomEvent('favoritos-cambiados'));
        }
      } else {
        const exito = await agregarFavorito(ejercicioId);
        if (exito) {
          setEsFavoritoEstado(true);
          onCambio?.(true);
          // Disparar evento personalizado para refrescar listas
          window.dispatchEvent(new CustomEvent('favoritos-cambiados'));
        }
      }
    } catch (error) {
      console.error('Error al cambiar favorito:', error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <Button
      variant={esFavoritoEstado ? 'primary' : 'ghost'}
      size="sm"
      onClick={toggleFavorito}
      disabled={cargando}
      className={className}
    >
      <Heart
        className={`w-4 h-4 mr-2 ${esFavoritoEstado ? 'fill-current' : ''}`}
      />
      {esFavoritoEstado ? 'Quitar de Favoritos' : 'Agregar a Favoritos'}
    </Button>
  );
};

