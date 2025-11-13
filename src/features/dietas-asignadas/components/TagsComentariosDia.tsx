import React, { useState } from 'react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { Tag, MessageSquare, X, Plus, Edit2 } from 'lucide-react';
import type { MetadatosDia } from '../types';

interface TagsComentariosDiaProps {
  dia: string;
  metadatos?: MetadatosDia;
  onActualizar: (metadatos: MetadatosDia) => void;
}

const tagsSugeridos = [
  'día pre-competición',
  'viaje',
  'día libre',
  'competición',
  'recuperación',
  'entreno intenso',
  'evento social',
  'ayuno intermitente',
];

export const TagsComentariosDia: React.FC<TagsComentariosDiaProps> = ({
  dia,
  metadatos,
  onActualizar,
}) => {
  const [editando, setEditando] = useState(false);
  const [mostrarTags, setMostrarTags] = useState(false);
  const [nuevoTag, setNuevoTag] = useState('');
  const [comentario, setComentario] = useState(metadatos?.comentario || '');
  const [tags, setTags] = useState<string[]>(metadatos?.tags || []);

  const handleGuardar = () => {
    onActualizar({
      dia,
      tags,
      comentario: comentario.trim() || undefined,
    });
    setEditando(false);
  };

  const handleCancelar = () => {
    setTags(metadatos?.tags || []);
    setComentario(metadatos?.comentario || '');
    setEditando(false);
    setMostrarTags(false);
    setNuevoTag('');
  };

  const handleAñadirTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setNuevoTag('');
    setMostrarTags(false);
  };

  const handleEliminarTag = (tagAEliminar: string) => {
    setTags(tags.filter(t => t !== tagAEliminar));
  };

  const tagsDisponibles = tagsSugeridos.filter(t => !tags.includes(t));

  if (!editando && (!metadatos || (!metadatos.tags?.length && !metadatos.comentario))) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setEditando(true)}
        className="text-xs text-slate-500 hover:text-slate-700"
        leftIcon={<Tag className="w-3 h-3" />}
      >
        Añadir contexto
      </Button>
    );
  }

  if (!editando) {
    return (
      <div className="space-y-2">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <Badge
                key={tag}
                className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
        {comentario && (
          <p className="text-xs text-slate-600 italic flex items-start gap-1">
            <MessageSquare className="w-3 h-3 mt-0.5 flex-shrink-0" />
            <span>{comentario}</span>
          </p>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setEditando(true)}
          className="text-xs text-slate-500 hover:text-slate-700 h-6"
          leftIcon={<Edit2 className="w-3 h-3" />}
        >
          Editar
        </Button>
      </div>
    );
  }

  return (
    <Card className="bg-white border border-blue-200 shadow-sm p-3 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-slate-900">Contexto del día</h4>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGuardar}
            className="text-xs h-6 px-2 text-green-600 hover:text-green-700"
          >
            Guardar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancelar}
            className="text-xs h-6 px-2 text-red-600 hover:text-red-700"
            leftIcon={<X className="w-3 h-3" />}
          >
            Cancelar
          </Button>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-700">Tags</label>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <Badge
                key={tag}
                className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1"
              >
                {tag}
                <button
                  onClick={() => handleEliminarTag(tag)}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        <div className="relative">
          {!mostrarTags ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMostrarTags(true)}
              className="text-xs h-6 px-2"
              leftIcon={<Plus className="w-3 h-3" />}
            >
              Añadir tag
            </Button>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-1">
                <input
                  type="text"
                  value={nuevoTag}
                  onChange={(e) => setNuevoTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && nuevoTag.trim()) {
                      handleAñadirTag(nuevoTag.trim());
                    } else if (e.key === 'Escape') {
                      setMostrarTags(false);
                      setNuevoTag('');
                    }
                  }}
                  placeholder="Escribe un tag..."
                  className="text-xs border border-slate-300 rounded px-2 py-1 flex-1"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMostrarTags(false)}
                  className="h-6 px-2"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
              {tagsDisponibles.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {tagsDisponibles.slice(0, 6).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleAñadirTag(tag)}
                      className="text-xs px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Comentario */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-700">Comentario</label>
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Añade un comentario contextual (ej: 'Viaje de trabajo, comidas fuera')"
          className="text-xs border border-slate-300 rounded px-2 py-1 w-full resize-none"
          rows={2}
        />
      </div>
    </Card>
  );
};

