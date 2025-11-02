import React, { useState, useRef } from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { Camera, X, Image as ImageIcon, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { FotoComida, subirFotoComida, evaluarFoto } from '../api/fotos';

interface FotosComidaProps {
  clienteId: string;
  checkInId?: string;
  fotos?: FotoComida[];
  onFotoSubida?: (foto: FotoComida) => void;
  soloLectura?: boolean;
}

export const FotosComida: React.FC<FotosComidaProps> = ({
  clienteId,
  checkInId,
  fotos = [],
  onFotoSubida,
  soloLectura = false,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tipoComida, setTipoComida] = useState<'desayuno' | 'almuerzo' | 'merienda' | 'cena' | 'snack'>('desayuno');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubirFoto = async () => {
    if (!fileInputRef.current?.files?.[0] || !checkInId) return;
    
    setSubiendo(true);
    try {
      const foto = await subirFotoComida(
        fileInputRef.current.files[0],
        checkInId,
        clienteId,
        tipoComida
      );
      
      if (foto && onFotoSubida) {
        onFotoSubida(foto);
      }
      
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error al subir foto:', error);
    } finally {
      setSubiendo(false);
    }
  };

  const handleEvaluar = async (fotoId: string, evaluacion: 'cumple' | 'parcial' | 'no_cumple') => {
    try {
      await evaluarFoto(fotoId, evaluacion);
      // Recargar fotos después de evaluar
      if (clienteId) {
        // Aquí se podría recargar la lista si fuera necesario
      }
    } catch (error) {
      console.error('Error al evaluar foto:', error);
    }
  };

  const getEvaluacionIcon = (evaluacion?: string) => {
    switch (evaluacion) {
      case 'cumple':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'parcial':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'no_cumple':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getTipoComidaLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      desayuno: 'Desayuno',
      almuerzo: 'Almuerzo',
      merienda: 'Merienda',
      cena: 'Cena',
      snack: 'Snack',
    };
    return labels[tipo] || tipo;
  };

  return (
    <div className="space-y-4">
      {!soloLectura && (
        <Card className="p-4 bg-white shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tipo de Comida
              </label>
              <select
                value={tipoComida}
                onChange={(e) => setTipoComida(e.target.value as any)}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              >
                <option value="desayuno">Desayuno</option>
                <option value="almuerzo">Almuerzo</option>
                <option value="merienda">Merienda</option>
                <option value="cena">Cena</option>
                <option value="snack">Snack</option>
              </select>
            </div>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="foto-comida"
              />
              <label htmlFor="foto-comida">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 transition-colors">
                  <Camera size={48} className="mx-auto mb-3 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Toca para seleccionar una foto
                  </p>
                </div>
              </label>
            </div>

            {preview && (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-xl"
                />
                <button
                  onClick={() => setPreview(null)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
                <Button
                  onClick={handleSubirFoto}
                  loading={subiendo}
                  fullWidth
                  className="mt-4"
                >
                  Subir Foto
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}

      {fotos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fotos.map((foto) => (
            <Card key={foto.id} variant="hover" className="h-full flex flex-col transition-shadow overflow-hidden bg-white shadow-sm">
              <div className="h-48 bg-gray-100">
                <img
                  src={foto.url}
                  alt={foto.descripcion || 'Foto de comida'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 space-y-2 flex flex-col flex-1">
                <div className="relative">
                  <div className="absolute top-2 right-2">
                    {getEvaluacionIcon(foto.evaluacionEntrenador)}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {getTipoComidaLabel(foto.tipoComida)}
                  </p>
                  {foto.descripcion && (
                    <p className="text-xs text-gray-500 mt-1">
                      {foto.descripcion}
                    </p>
                  )}
                </div>
                {!soloLectura && !foto.evaluacionEntrenador && (
                  <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => foto.id && handleEvaluar(foto.id, 'cumple')}
                    >
                      <CheckCircle size={12} className="mr-1" />
                      Cumple
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => foto.id && handleEvaluar(foto.id, 'parcial')}
                    >
                      <AlertCircle size={12} className="mr-1" />
                      Parcial
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => foto.id && handleEvaluar(foto.id, 'no_cumple')}
                    >
                      <XCircle size={12} className="mr-1" />
                      No Cumple
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {fotos.length === 0 && soloLectura && (
        <Card className="p-8 text-center bg-white shadow-sm">
          <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin fotos disponibles</h3>
          <p className="text-gray-600 mb-4">No hay fotos de comida disponibles</p>
        </Card>
      )}
    </div>
  );
};

