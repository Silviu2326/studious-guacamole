import React, { useState } from 'react';
import { Card, Button, Table } from '../../../components/componentsreutilizables';
import { ShoppingCart, Download, CheckCircle2 } from 'lucide-react';
import { generarListaCompra, type ListaCompra, type ItemListaCompra } from '../api/planificador';
import { type Dieta } from '../api/editor';
import { ds } from '../../adherencia/ui/ds';

interface GeneradorListaCompraProps {
  dieta: Dieta;
}

export const GeneradorListaCompra: React.FC<GeneradorListaCompraProps> = ({ dieta }) => {
  const [listaCompra, setListaCompra] = useState<ListaCompra | null>(null);
  const [generando, setGenerando] = useState(false);

  const handleGenerar = async () => {
    setGenerando(true);
    try {
      const lista = await generarListaCompra(dieta.id);
      if (lista) {
        setListaCompra(lista);
      } else {
        // Fallback: generar lista básica desde comidas
        const items: ItemListaCompra[] = dieta.comidas.flatMap((comida) =>
          comida.alimentos.map((alimento) => ({
            alimento: alimento.nombre,
            cantidad: alimento.cantidad,
            unidad: alimento.unidad,
            categoria: 'General',
            prioridad: 'media' as const,
            adquirido: false,
          }))
        );

        // Agrupar items por alimento
        const agrupados = items.reduce((acc, item) => {
          const existente = acc.find((i) => i.alimento === item.alimento);
          if (existente) {
            existente.cantidad += item.cantidad;
          } else {
            acc.push({ ...item });
          }
          return acc;
        }, [] as ItemListaCompra[]);

        setListaCompra({
          id: Date.now().toString(),
          dietaId: dieta.id,
          items: agrupados,
          fechaCreacion: new Date(),
        });
      }
    } catch (error) {
      console.error('Error generando lista de compra:', error);
    } finally {
      setGenerando(false);
    }
  };

  const toggleAdquirido = (index: number) => {
    if (!listaCompra) return;
    const nuevosItems = [...listaCompra.items];
    nuevosItems[index].adquirido = !nuevosItems[index].adquirido;
    setListaCompra({ ...listaCompra, items: nuevosItems });
  };

  const exportarLista = () => {
    if (!listaCompra) return;

    const texto = listaCompra.items
      .map((item) => `- [${item.adquirido ? 'x' : ' '}] ${item.cantidad} ${item.unidad} ${item.alimento}`)
      .join('\n');

    const blob = new Blob([texto], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lista-compra-${dieta.nombre}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const columnas = [
    {
      key: 'check',
      label: '',
      render: (_: ItemListaCompra, index: number) => (
        <button
          onClick={() => toggleAdquirido(index)}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
            listaCompra?.items[index].adquirido
              ? 'bg-blue-600 border-blue-600'
              : 'border-gray-300'
          }`}
        >
          {listaCompra?.items[index].adquirido && (
            <CheckCircle2 className="w-4 h-4 text-white" />
          )}
        </button>
      ),
    },
    {
      key: 'alimento',
      label: 'Alimento',
      render: (item: ItemListaCompra) => (
        <span className={`font-medium ${item.adquirido ? 'line-through text-gray-400' : 'text-gray-900'}`}>
          {item.alimento}
        </span>
      ),
    },
    {
      key: 'cantidad',
      label: 'Cantidad',
      render: (item: ItemListaCompra) => (
        <span className={`text-gray-700 ${item.adquirido ? 'line-through' : ''}`}>
          {item.cantidad} {item.unidad}
        </span>
      ),
    },
    {
      key: 'categoria',
      label: 'Categoría',
      render: (item: ItemListaCompra) => (
        <span className="text-gray-600">{item.categoria}</span>
      ),
    },
    {
      key: 'prioridad',
      label: 'Prioridad',
      render: (item: ItemListaCompra) => {
        const colores = {
          alta: 'bg-red-100 text-red-800',
          media: 'bg-yellow-100 text-yellow-800',
          baja: 'bg-green-100 text-green-800',
        };
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              colores[item.prioridad || 'media']
            }`}
          >
            {item.prioridad || 'media'}
          </span>
        );
      },
    },
  ];

  return (
    <Card className="p-6 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ShoppingCart size={24} className="text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">
            Generador de Lista de Compra
          </h2>
        </div>
        <div className="flex gap-2">
          {listaCompra && (
            <Button variant="secondary" onClick={exportarLista}>
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          )}
          <Button onClick={handleGenerar} loading={generando}>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Generar Lista
          </Button>
        </div>
      </div>

      {listaCompra ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Creada el {listaCompra.fechaCreacion.toLocaleDateString('es-ES')}
            </span>
            <span>
              {listaCompra.items.filter((i) => i.adquirido).length} de {listaCompra.items.length} adquiridos
            </span>
          </div>

          <Table
            columns={columnas}
            data={listaCompra.items}
            emptyMessage="No hay items en la lista de compra"
          />
        </div>
      ) : (
        <div className="text-center py-8">
          <ShoppingCart size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay lista de compra</h3>
          <p className="text-gray-600 mb-4">
            Haz clic en "Generar Lista" para crear una lista de compra basada en los alimentos de la dieta.
          </p>
        </div>
      )}
    </Card>
  );
};

