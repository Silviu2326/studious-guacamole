import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Badge } from '../../../components/componentsreutilizables';
import { 
  ShoppingCart, 
  CheckCircle2, 
  Circle, 
  Edit, 
  Trash2,
  Download,
  Send,
  Plus
} from 'lucide-react';
import { 
  type ListaCompra, 
  getListasCompra, 
  eliminarListaCompra,
  actualizarListaCompra 
} from '../api';
import { getNombreSeccion } from '../api/ingredientes';

interface ListaCompraProps {
  clienteId?: string;
  onGenerarNueva?: () => void;
  onEditar?: (lista: ListaCompra) => void;
}

export const ListaCompra: React.FC<ListaCompraProps> = ({ 
  clienteId,
  onGenerarNueva,
  onEditar 
}) => {
  const [listas, setListas] = useState<ListaCompra[]>([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargarListas();
  }, [clienteId]);

  const cargarListas = async () => {
    setCargando(true);
    try {
      const data = await getListasCompra(clienteId);
      setListas(data);
    } catch (error) {
      console.error('Error cargando listas:', error);
    } finally {
      setCargando(false);
    }
  };

  const toggleMarcado = async (listaId: string, ingredienteId: string) => {
    const lista = listas.find((l) => l.id === listaId);
    if (!lista) return;

    const nuevosIngredientes = lista.ingredientes.map((ing) =>
      ing.id === ingredienteId ? { ...ing, marcado: !ing.marcado } : ing
    );

    await actualizarListaCompra(listaId, { ingredientes: nuevosIngredientes });
    cargarListas();
  };

  const columnas = [
    {
      key: 'clienteNombre',
      label: 'Cliente',
      render: (lista: ListaCompra) => (
        <span className="font-medium">{lista.clienteNombre}</span>
      ),
    },
    {
      key: 'dietaNombre',
      label: 'Dieta',
      render: (lista: ListaCompra) => (
        <span className="text-gray-600 dark:text-gray-400">
          {lista.dietaNombre || 'Sin dieta asignada'}
        </span>
      ),
    },
    {
      key: 'ingredientes',
      label: 'Ingredientes',
      render: (lista: ListaCompra) => (
        <Badge variant="blue">
          {lista.ingredientes.length} items
        </Badge>
      ),
    },
    {
      key: 'numeroPersonas',
      label: 'Personas',
      render: (lista: ListaCompra) => (
        <span>{lista.numeroPersonas}</span>
      ),
    },
    {
      key: 'fechaCreacion',
      label: 'Creada',
      render: (lista: ListaCompra) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(lista.fechaCreacion).toLocaleDateString('es-ES')}
        </span>
      ),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (lista: ListaCompra) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEditar?.(lista)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={async () => {
              if (confirm('¿Eliminar esta lista?')) {
                await eliminarListaCompra(lista.id);
                cargarListas();
              }
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card className="p-6 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ShoppingCart className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-semibold text-gray-900">
            Listas de Compra
          </h2>
        </div>
        {onGenerarNueva && (
          <Button onClick={onGenerarNueva}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Lista
          </Button>
        )}
      </div>

      <Table
        columns={columnas}
        data={listas}
        loading={cargando}
        emptyMessage="No hay listas de compra creadas. Genera una nueva lista para comenzar."
      />
    </Card>
  );
};

