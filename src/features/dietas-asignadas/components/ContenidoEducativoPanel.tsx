import React, { useState, useEffect } from 'react';
import { Card, Badge, Button } from '../../../components/componentsreutilizables';
import {
  BookOpen,
  Video,
  FileText,
  Image as ImageIcon,
  Headphones,
  ChefHat,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import type { Dieta, SugerenciasContenidoEducativo, ContenidoEducativo, TipoContenidoEducativo } from '../types';
import { getSugerenciasContenidoEducativo } from '../api/contenidoEducativo';

interface ContenidoEducativoPanelProps {
  dieta: Dieta;
}

export const ContenidoEducativoPanel: React.FC<ContenidoEducativoPanelProps> = ({ dieta }) => {
  const [sugerencias, setSugerencias] = useState<SugerenciasContenidoEducativo | null>(null);
  const [cargando, setCargando] = useState(true);
  const [contenidoExpandido, setContenidoExpandido] = useState<string | null>(null);

  useEffect(() => {
    cargarSugerencias();
  }, [dieta.id]);

  const cargarSugerencias = async () => {
    setCargando(true);
    try {
      const data = await getSugerenciasContenidoEducativo(dieta.id);
      setSugerencias(data);
    } catch (error) {
      console.error('Error cargando sugerencias de contenido educativo:', error);
    } finally {
      setCargando(false);
    }
  };

  const getIconoTipoContenido = (tipo: TipoContenidoEducativo) => {
    switch (tipo) {
      case 'articulo':
        return <FileText className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'infografia':
        return <ImageIcon className="w-4 h-4" />;
      case 'podcast':
        return <Headphones className="w-4 h-4" />;
      case 'receta':
        return <ChefHat className="w-4 h-4" />;
    }
  };

  const getLabelTipoContenido = (tipo: TipoContenidoEducativo) => {
    switch (tipo) {
      case 'articulo':
        return 'Artículo';
      case 'video':
        return 'Vídeo';
      case 'infografia':
        return 'Infografía';
      case 'podcast':
        return 'Podcast';
      case 'receta':
        return 'Receta';
    }
  };

  const getColorSeveridad = (severidad: 'alta' | 'media' | 'baja') => {
    switch (severidad) {
      case 'alta':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'media':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baja':
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getColorDificultad = (dificultad: 'basico' | 'intermedio' | 'avanzado') => {
    switch (dificultad) {
      case 'basico':
        return 'bg-green-100 text-green-800';
      case 'intermedio':
        return 'bg-yellow-100 text-yellow-800';
      case 'avanzado':
        return 'bg-red-100 text-red-800';
    }
  };

  const handleAbrirContenido = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (cargando) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span className="ml-2 text-sm text-gray-600">Cargando contenido educativo...</span>
        </div>
      </Card>
    );
  }

  if (!sugerencias) {
    return (
      <Card className="p-6">
        <p className="text-sm text-gray-600 text-center">No hay sugerencias disponibles</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <BookOpen className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Contenido Educativo Sugerido</h3>
            <p className="text-sm text-gray-600">Refuerza la adherencia con información relevante</p>
          </div>
        </div>
        <Badge className="bg-purple-100 text-purple-800">
          {sugerencias.retos.length} reto(s) detectado(s)
        </Badge>
      </div>

      {/* Resumen */}
      <Card className="p-4 bg-purple-50 border-purple-200">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-purple-900 mb-1">Resumen</p>
            <p className="text-sm text-purple-800">{sugerencias.resumen}</p>
          </div>
        </div>
      </Card>

      {/* Retos Detectados */}
      {sugerencias.retos.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-orange-600" />
            Retos Detectados
          </h4>
          <div className="space-y-3">
            {sugerencias.retos.map((reto) => (
              <Card key={reto.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-semibold text-gray-900">{reto.titulo}</h5>
                      <Badge className={getColorSeveridad(reto.severidad)}>
                        {reto.severidad}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{reto.descripcion}</p>
                    {reto.evidencias && reto.evidencias.length > 0 && (
                      <div className="text-xs text-gray-500">
                        <span className="font-medium">Evidencias: </span>
                        {reto.evidencias.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
                {reto.contenidoRecomendado.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-xs font-medium text-gray-700 mb-2">
                      Contenido recomendado ({reto.contenidoRecomendado.length}):
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {reto.contenidoRecomendado.slice(0, 3).map((contenido) => (
                        <Badge
                          key={contenido.id}
                          className="bg-gray-100 text-gray-700 cursor-pointer hover:bg-gray-200"
                          onClick={() => handleAbrirContenido(contenido.url)}
                        >
                          {getIconoTipoContenido(contenido.tipo)}
                          <span className="ml-1">{contenido.titulo}</span>
                        </Badge>
                      ))}
                      {reto.contenidoRecomendado.length > 3 && (
                        <Badge className="bg-gray-100 text-gray-700">
                          +{reto.contenidoRecomendado.length - 3} más
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Contenido Prioritario */}
      {sugerencias.contenidoPrioritario.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            Contenido Prioritario Recomendado
          </h4>
          <div className="space-y-3">
            {sugerencias.contenidoPrioritario.map((contenido) => (
              <Card
                key={contenido.id}
                className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setContenidoExpandido(
                  contenidoExpandido === contenido.id ? null : contenido.id
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                    {getIconoTipoContenido(contenido.tipo)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h5 className="font-semibold text-gray-900 line-clamp-2">{contenido.titulo}</h5>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Badge className="bg-purple-100 text-purple-800">
                          {contenido.relevancia}% relevante
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{contenido.descripcion}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className="bg-gray-100 text-gray-700">
                        {getLabelTipoContenido(contenido.tipo)}
                      </Badge>
                      <Badge className={getColorDificultad(contenido.dificultad)}>
                        {contenido.dificultad}
                      </Badge>
                      {contenido.duracion && (
                        <Badge className="bg-gray-100 text-gray-700">
                          {contenido.duracion} min
                        </Badge>
                      )}
                      {contenido.fuente && (
                        <Badge className="bg-gray-100 text-gray-700">{contenido.fuente}</Badge>
                      )}
                    </div>
                    {contenidoExpandido === contenido.id && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        {contenido.tags && contenido.tags.length > 0 && (
                          <div className="mb-2">
                            <div className="text-xs text-gray-500 mb-1">Tags:</div>
                            <div className="flex flex-wrap gap-1">
                              {contenido.tags.map((tag, idx) => (
                                <Badge key={idx} className="bg-blue-100 text-blue-800 text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAbrirContenido(contenido.url);
                          }}
                          className="w-full"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Abrir Contenido
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

