import React, { useState } from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { generarListaCompra } from '../api/lista-compra';
import { ListaCompra, Receta } from '../types';
import { ShoppingCart, Download, Printer, CheckCircle2 } from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';

interface GeneradorListaCompraProps {
  recetasSeleccionadas: Receta[];
  onGenerar?: (lista: ListaCompra) => void;
}

export const GeneradorListaCompra: React.FC<GeneradorListaCompraProps> = ({
  recetasSeleccionadas,
  onGenerar,
}) => {
  const [lista, setLista] = useState<ListaCompra | null>(null);
  const [generando, setGenerando] = useState(false);

  const handleGenerar = async () => {
    if (recetasSeleccionadas.length === 0) {
      alert('Debe seleccionar al menos una receta');
      return;
    }

    setGenerando(true);
    try {
      const listaGenerada = await generarListaCompra(recetasSeleccionadas.map(r => r.id));
      setLista(listaGenerada);
      if (onGenerar) {
        onGenerar(listaGenerada);
      }
    } catch (error) {
      console.error('Error generando lista:', error);
      alert('Error al generar la lista de compra');
    } finally {
      setGenerando(false);
    }
  };

  const handleImprimir = () => {
    window.print();
  };

  const handleDescargar = () => {
    if (!lista) return;
    
    const contenido = `LISTA DE COMPRA\n\n${lista.ingredientes.map((ing, idx) => 
      `${idx + 1}. ${ing.nombre}: ${ing.cantidadTotal} ${ing.unidad}`
    ).join('\n')}\n\nRecetas incluidas:\n${lista.recetas.join(', ')}`;
    
    const blob = new Blob([contenido], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lista-compra-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (lista) {
    return (
      <Card variant="hover" padding="md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Lista de Compra Generada
            </h3>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={handleImprimir}>
              <Printer className="w-4 h-4 mr-2" />
              Imprimir
            </Button>
            <Button variant="secondary" size="sm" onClick={handleDescargar}>
              <Download className="w-4 h-4 mr-2" />
              Descargar
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setLista(null)}>
              Nueva Lista
            </Button>
          </div>
        </div>
        <div className="space-y-3">
          {lista.ingredientes.map((ingrediente, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div>
                <p className={`${ds.typography.body} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                  {ingrediente.nombre}
                </p>
                {ingrediente.recetas.length > 0 && (
                  <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                    Usado en: {ingrediente.recetas.join(', ')}
                  </p>
                )}
              </div>
              <span className={`${ds.typography.body} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                {ingrediente.cantidadTotal} {ingrediente.unidad}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Recetas incluidas: {lista.recetas.join(', ')}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="hover" padding="md">
      <div className="text-center py-8">
        <ShoppingCart className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
        <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
          Generar Lista de Compra
        </h3>
        <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-6`}>
          Selecciona las recetas que deseas incluir y genera una lista de compra automática con todos los ingredientes necesarios.
        </p>
        <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-6`}>
          {recetasSeleccionadas.length} {recetasSeleccionadas.length === 1 ? 'receta seleccionada' : 'recetas seleccionadas'}
        </p>
        <Button onClick={handleGenerar} disabled={recetasSeleccionadas.length === 0 || generando}>
          <ShoppingCart className="w-4 h-4 mr-2" />
          {generando ? 'Generando...' : 'Generar Lista'}
        </Button>
      </div>
    </Card>
  );
};

